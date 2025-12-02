import { z } from "zod";


export const editProfileSchema = z.object({
  
  full_name: z
    .string()
    .min(3, { message: "Ime i prezime moraju imati bar 3 karaktera." })
    .max(100, { message: "Ime i prezime mogu imati najviše 100 karaktera." })
    .optional() 
    .or(z.literal('')),
    
  city: z
    .string()
    .min(2, { message: "Grad mora imati bar 2 karaktera." })
    .max(50, { message: "Grad može imati najviše 50 karaktera." })
    .optional() 
    .or(z.literal('')), 
    
});


export type EditProfileSchema = z.infer<typeof editProfileSchema>;