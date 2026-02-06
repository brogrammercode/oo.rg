import { Router } from "express";
import OrgController from "../controllers/org.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

class OrgRoutes {
    public router: Router;
    private orgController: OrgController;

    constructor() {
        this.router = Router();
        this.orgController = new OrgController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/find", this.orgController.findOrg);
        this.router.post("/create", authenticate, this.orgController.createOrg);

        this.router.get("/:orgId/employee/my", authenticate, this.orgController.getMyEmployee);
        this.router.get("/:orgId/employee", authenticate, this.orgController.getAllEmployees);
        this.router.post("/:orgId/employee", authenticate, this.orgController.createEmployee);
        this.router.post("/:orgId/employee/request", authenticate, this.orgController.requestEmployee);
        this.router.put("/employee/:employeeId", authenticate, this.orgController.updateEmployee);
        this.router.delete("/employee/:employeeId", authenticate, this.orgController.deleteEmployee);

        this.router.get("/:orgId/role", authenticate, this.orgController.getAllRoles);
        this.router.post("/:orgId/role", authenticate, this.orgController.createRole);
        this.router.put("/role/:roleId", authenticate, this.orgController.updateRole);
        this.router.delete("/role/:roleId", authenticate, this.orgController.deleteRole);

        this.router.get("/:orgId/department", authenticate, this.orgController.getAllDepartments);
        this.router.post("/:orgId/department", authenticate, this.orgController.createDepartment);
        this.router.put("/department/:departmentId", authenticate, this.orgController.updateDepartment);
        this.router.delete("/department/:departmentId", authenticate, this.orgController.deleteDepartment);

        this.router.get("/:orgId/:departmentId/post", authenticate, this.orgController.getAllPosts);
        this.router.post("/:orgId/:departmentId/post", authenticate, this.orgController.createPost);
        this.router.put("/post/:postId", authenticate, this.orgController.updatePost);
        this.router.delete("/post/:postId", authenticate, this.orgController.deletePost);

    }
}

const orgRoutes = new OrgRoutes();
export default orgRoutes.router;