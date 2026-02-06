import mongoose from "mongoose";

const orgSchema = new mongoose.Schema(
    {
        name: { type: String },
        description: { type: String },
        logo: { type: String },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    },
    { timestamps: true },
);

const roleSchema = new mongoose.Schema(
    {
        name: { type: String },
        description: { type: String },
        color: { type: String },
        org: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orgs",
        },
        permissions: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true },
);

const departmentSchema = new mongoose.Schema(
    {
        name: { type: String },
        description: { type: String },
        logo: { type: String },
        color: { type: String },
        org: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orgs",
        },
    },
    { timestamps: true },
);

const postSchema = new mongoose.Schema(
    {
        name: { type: String },
        description: { type: String },
        color: { type: String },
        logo: { type: String },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "departments",
        },
        org: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orgs",
        },
    },
    { timestamps: true },
);

const employeeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        org: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orgs",
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts",
        },
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "roles",
        }],
        joined_at: {
            type: Date,

            default: Date.now,
        },
        resigned_at: {
            type: Date,
            required: false,
        },
        status: {
            type: String,
        },
    },
    { timestamps: true },
);

const Org = mongoose.model("orgs", orgSchema);
const Role = mongoose.model("roles", roleSchema);
const Department = mongoose.model("departments", departmentSchema);
const Post = mongoose.model("posts", postSchema);
const Employee = mongoose.model("employees", employeeSchema);

export { Org, Role, Department, Post, Employee };
