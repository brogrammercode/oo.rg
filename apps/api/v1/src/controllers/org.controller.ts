import { Request, Response } from "express";
import asyncHandler from "../middlewares/async-handler.js";
import { Department, Employee, Org, Post, Role } from "../models/org.model.js";
import { BadRequestError } from "../utils/error.js";
import { Messages } from "../constants/messages.js";
import { sendSuccess } from "../utils/response.js";
import { HttpStatus } from "../constants/http-status.js";
import { EmployeeStatus } from "../constants/org.js";
import User from "../models/user.model.js";

class OrgController {
    // ORG
    findOrg = asyncHandler(async (req: Request, res: Response) => {
        const { name } = req.query;
        const orgs = await Org.find({
            name: { $regex: (name as string) || "", $options: "i" }
        }).lean().populate("owner", "name email");

        sendSuccess(res, { orgs }, "Orgs retrieved successfully", HttpStatus.OK);
    });

    createOrg = asyncHandler(async (req: Request, res: Response) => {
        const { name } = req.body;
        if (!name) throw new BadRequestError(Messages.INVALID_CREDENTIALS);

        const org = await Org.create({ name, owner: req.user?.userId });
        await org.populate("owner", "name email");

        const role = await Role.create({
            org: org._id,
            name: "Owner",
            permissions: ["ALL"],
        });

        const employee = await Employee.create({
            org: org._id,
            user: req.user?.userId,
            status: EmployeeStatus.ACCEPTED,
            roles: [role._id]
        });

        await employee.populate([
            { path: "user", select: "name email" },
            { path: "roles", select: "name permissions" }
        ]);

        sendSuccess(res, { org, employee }, "Org created successfully", HttpStatus.CREATED);
    });

    // EMPLOYEE
    getMyEmployee = asyncHandler(async (req: Request, res: Response) => {
        const employee = await Employee.findOne({ user: req.user?.userId, org: req.params.orgId }).populate("user", "name email").populate("roles", "name permissions");
        if (!employee) throw new BadRequestError("Employee not found");
        sendSuccess(res, { employee: employee }, "Employee retrieved successfully", HttpStatus.OK);
    });

    getAnyEmployee = asyncHandler(async (req: Request, res: Response) => {
        const employee = await Employee.findOne({
            user: req.params.userId,
            status: { $nin: [EmployeeStatus.REJECTED, EmployeeStatus.REQUESTED, EmployeeStatus.RESIGNED] }
        })
            .populate([
                { path: "org", select: "name" },
                { path: "user", select: "name email" },
                { path: "roles", select: "name permissions" },
                {
                    path: "post",
                    select: "name department logo",
                    populate: {
                        path: "department",
                        select: "name description color"
                    }
                }
            ]);

        if (!employee) throw new BadRequestError("Employee not found");

        sendSuccess(res, { employee }, "Employee retrieved successfully", HttpStatus.OK);
    });

    getAllEmployees = asyncHandler(async (req: Request, res: Response) => {
        const employees = await Employee.find({ org: req.params.orgId })
            .populate("user", "name email")
            .populate("roles", "name permissions")
            .populate({
                path: "post",
                select: "name department logo",
                populate: {
                    path: "department",
                    select: "name description color"
                }
            });
        sendSuccess(res, { employees }, "Employees retrieved successfully", HttpStatus.OK);
    });

    createEmployee = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const { name, email, password, role, post } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const existingEmployee = await Employee.findOne({ org: orgId, user: existingUser._id });
            if (existingEmployee) { throw new BadRequestError("Employee already exists") };
            const newEmployee = await Employee.create({ org: orgId, user: existingUser._id, roles: [role], post, status: EmployeeStatus.ACCEPTED });
            sendSuccess(res, { employee: newEmployee }, "Employee created successfully", HttpStatus.CREATED);
        } else {
            const user = await User.create({ name, email, password });
            const newEmployee = await Employee.create({ org: orgId, user: user._id, roles: [role], post, status: EmployeeStatus.ACCEPTED });
            sendSuccess(res, { employee: newEmployee }, "Employee created successfully", HttpStatus.CREATED);
        }
    });

    requestEmployee = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const userId = req.user?.userId;
        const employee = await Employee.findOne({ org: orgId, user: userId });
        if (employee) throw new BadRequestError("Employee already exists");
        const newEmployee = await Employee.create({ org: orgId, user: userId, status: EmployeeStatus.REQUESTED });
        sendSuccess(res, { employee: newEmployee }, "Employee requested successfully", HttpStatus.CREATED);
    });

    updateEmployee = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        const { post, roles, status } = req.body;
        const employee = await Employee.findByIdAndUpdate(employeeId, { post, roles, status }, { new: true });
        sendSuccess(res, employee, "Employee updated successfully", HttpStatus.OK);
    });

    deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        const employee = await Employee.findByIdAndDelete(employeeId);
        sendSuccess(res, employee, "Employee deleted successfully", HttpStatus.OK);
    });

    // ROLE
    getAllRoles = asyncHandler(async (req: Request, res: Response) => {
        const roles = await Role.find({ org: req.params.orgId });
        sendSuccess(res, { roles }, "Roles retrieved successfully", HttpStatus.OK);
    });

    createRole = asyncHandler(async (req: Request, res: Response) => {
        const { name, description, color, permissions } = req.body;
        const role = await Role.create({ org: req.params.orgId, name, description, color, permissions });
        sendSuccess(res, { role }, "Role created successfully", HttpStatus.CREATED);
    });

    updateRole = asyncHandler(async (req: Request, res: Response) => {
        const { roleId } = req.params;
        const { name, description, color, permissions } = req.body;
        const role = await Role.findByIdAndUpdate(roleId, { name, description, color, permissions }, { new: true });
        sendSuccess(res, { role }, "Role updated successfully", HttpStatus.OK);
    });

    deleteRole = asyncHandler(async (req: Request, res: Response) => {
        const { roleId } = req.params;
        const role = await Role.findByIdAndDelete(roleId);
        sendSuccess(res, { role }, "Role deleted successfully", HttpStatus.OK);
    });

    // DEPARTMENT
    getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
        const departments = await Department.find({ org: req.params.orgId });
        sendSuccess(res, { departments }, "Departments retrieved successfully", HttpStatus.OK);
    });

    createDepartment = asyncHandler(async (req: Request, res: Response) => {
        const { name, description, color } = req.body;
        const department = await Department.create({ org: req.params.orgId, name, description, color });
        sendSuccess(res, { department }, "Department created successfully", HttpStatus.CREATED);
    });

    updateDepartment = asyncHandler(async (req: Request, res: Response) => {
        const { departmentId } = req.params;
        const { name, description, color } = req.body;
        const department = await Department.findByIdAndUpdate(departmentId, { name, description, color }, { new: true });
        sendSuccess(res, { department }, "Department updated successfully", HttpStatus.OK);
    });

    deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
        const { departmentId } = req.params;
        const department = await Department.findByIdAndDelete(departmentId);
        sendSuccess(res, { department }, "Department deleted successfully", HttpStatus.OK);
    });

    // POST
    getAllPosts = asyncHandler(async (req: Request, res: Response) => {
        const posts = await Post.find({ org: req.params.orgId, department: req.params.departmentId }).populate("department", "name description color");
        sendSuccess(res, { posts }, "Posts retrieved successfully", HttpStatus.OK);
    });

    createPost = asyncHandler(async (req: Request, res: Response) => {
        const { name, description, color } = req.body;
        const post = await Post.create({ org: req.params.orgId, department: req.params.departmentId, name, description, color });
        sendSuccess(res, { post }, "Post created successfully", HttpStatus.CREATED);
    });

    updatePost = asyncHandler(async (req: Request, res: Response) => {
        const { postId } = req.params;
        const { name, description, color } = req.body;
        const post = await Post.findByIdAndUpdate(postId, { name, description, color }, { new: true });
        sendSuccess(res, { post }, "Post updated successfully", HttpStatus.OK);
    });

    deletePost = asyncHandler(async (req: Request, res: Response) => {
        const { postId } = req.params;
        const post = await Post.findByIdAndDelete(postId);
        sendSuccess(res, { post }, "Post deleted successfully", HttpStatus.OK);
    });
}

export default OrgController;