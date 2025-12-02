import { z } from "zod";

export const signupSchema = z
  .object({
    full_name: z
      .string()
      .min(3, { message: "Ime i prezime moraju imati bar 3 karaktera." })
      .max(100, { message: "Ime i prezime mogu imati najviše 100 karaktera." }),

    email: z.string().email({ message: "Unesite validnu email adresu." }),

    password: z
      .string()
      .min(8, { message: "Lozinka mora imati bar 8 karaktera." }),

    confirmPassword: z
      .string()
      .min(1, { message: "Potvrdite lozinku." }), 

    city: z
      .string()
      .min(2, { message: "Grad mora imati bar 2 karaktera." })
      .max(50, { message: "Grad može imati najviše 50 karaktera." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne podudaraju!",
    path: ["confirmPassword"], 
  });

export type SignupSchema = z.infer<typeof signupSchema>;

