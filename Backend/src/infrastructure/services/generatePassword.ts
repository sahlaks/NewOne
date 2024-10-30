export function generateRandomPassword(length: number = 8): string {
    const chars: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password: string = "";
    
    for (let i = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    
    return password;
  }

  