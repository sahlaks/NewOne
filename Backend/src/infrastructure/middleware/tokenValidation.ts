import { Request, Response, NextFunction } from "express";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../services/tokenVerification";
import { ParentRepository } from "../repository/parentRepository";
import { DoctorRepository } from "../repository/doctorRepository";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/*.................................for parent............................................*/
export const validateTokens = (
  requiredRole: string
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.access_token;
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken)
        return res.status(401).json({ message: "Refresh Token Expired" });

      const refreshTokenValid = verifyRefreshToken(refreshToken);

      if (!refreshTokenValid || !refreshTokenValid.id) {
        return res
          .status(401)
          .json({ success: false, message: "Refresh Token Expired" });
      }

      if (!accessToken) {
        return res
          .status(401)
          .json({ success: false, message: "Access Token Expired" });
      }

      const decoded = verifyAccessToken(accessToken);
      if (!decoded.id || !decoded || !decoded.role) {
        return res
          .status(401)
          .json({ success: false, message: "Access Token Expired" });
      }
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      if (decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: `Access denied. Requires role: ${requiredRole}` });
      }

      next();
    } catch (err) {}
  };
};

/*..........................................for doctor validation.................................*/
export const validateDoctorTokens = (
  requiredRole: string
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.doc_auth_token;
      const refreshToken = req.cookies.doc_refresh_token;

      if (!refreshToken)
        return res.status(401).json({ message: "Refresh Token Expired" });

      const refreshTokenValid = verifyRefreshToken(refreshToken);
    
      if (!refreshTokenValid.id) {
        return res
          .status(401)
          .json({ success: false, message: "Refresh Token Expired" });
      }

      if (!accessToken) {
        return res
          .status(401)
          .json({ success: false, message: "Access Token Expired" });
      }

      const decoded = verifyAccessToken(accessToken);

      if (!decoded.id || !decoded) {
        return res
          .status(401)
          .json({ success: false, message: "Access Token Expired" });
      }
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      if (decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: `Access denied. Requires role: ${requiredRole}` });
      }
      next();
    } catch (err) {}
  };
};
