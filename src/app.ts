import express, { Application } from "express";
import ip from "ip";
import cors from "cors";
import TeacherRoutes from "./routes/TeachersRoutes";
import StudentsRoutes from "./routes/StudentsRoutes";

export class App {
    private readonly app: Application;
    private readonly APPLICATION_RUNNING = "Application is running on:";
    private readonly ROUTE_NOT_FOUND = "Route does not exist on the server";
    private readonly API_PREFIX_List = "/jk-Nana/schools/mis-app";

    constructor(private readonly port: string | number = process.env.SERVER_PORT || 5000) {
        this.app = express();
        this.middleware();
        this.routes();
    }

    listen(): void {
        this.app.listen(this.port, () => {
            console.log(`${this.APPLICATION_RUNNING} http://${ip.address()}:${this.port}`);
        });
    }

    private middleware(): void {
        const allowedOrigins = [
            `http://${ip.address()}:3000`,
            `http://${ip.address()}:5000`,
            "http://localhost:3000",
            "http://localhost:5000",
        ];
        this.app.use(cors({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
        }));
        this.app.use(express.json());
    }

    private routes(): void {
        //teacher routes
        this.app.use(`${this.API_PREFIX_List}/lists`, TeacherRoutes);
        this.app.use(`${this.API_PREFIX_List}/lists/teachers/:id`, TeacherRoutes);

        //students routes
        this.app.use(`${this.API_PREFIX_List}/lists`, StudentsRoutes);
        this.app.use(`${this.API_PREFIX_List}/lists/students/:id`, StudentsRoutes);

    }

}