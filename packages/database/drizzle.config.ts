import type { Config } from 'drizzle-kit';                                   
                                                                               
  export default {                                                             
    schema: './src/schema.ts',                                                 
    out: './migrations',                                                       
    dialect: 'postgresql',                                                     
    dbCredentials: {                                                           
      url: process.env.DATABASE_URL ||                                         
  'postgresql://opencoach:opencoach_dev@localhost:5432/opencoach',             
    },                                                                         
  } satisfies Config;
