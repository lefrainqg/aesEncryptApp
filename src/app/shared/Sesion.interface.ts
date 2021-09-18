export interface Sesion {
  sesId?: number;
  sesLastAccess?: Date;
  sesPassword?: string;
  sesState?: boolean;
  sesUser?: string;
  sesUsername?: string;
}
