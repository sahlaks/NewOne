import jwt from 'jsonwebtoken';

export function jwtCreation(id: string, role: string): string {
    const payload = {
        id: id,
        role: role,  
      };
    
    try {
        const accessToken = jwt.sign(payload, process.env.AUTHTOKEN_KEY!, { expiresIn: '15m' });
        return accessToken;
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Error generating JWT token');
    }
}

export function refreshToken(id: string, role: string): string {
    const payload = {
        id: id,
        role: role, 
      };
    
    try{
        const refreshToken = jwt.sign(payload, process.env.REFRESHTOKEN_KEY!, {expiresIn: '7d'})
        return refreshToken;
    } catch (error) {
        console.error('Error generating refresh token:', error);
        throw new Error('Error generating refresh token');
    }
}