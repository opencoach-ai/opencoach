import { db } from '@opencoach/database';                   
import { createClient } from 'redis';                                             
                                                                                                              
export async function checkPostgreSQL(): Promise<boolean> {                                                   
  try {                                                                                                       
    await db.execute('SELECT 1');                                                                             
    return true;                                                                                              
  } catch (error) {                                                                                           
    console.error('PostgreSQL error:', error);                                                                
    return false;                                                                                             
  }                                                                                                           
}

export async function checkRedis(): Promise<boolean> {                    
  try {                                                                   
    const client = createClient({                                         
      socket: {                                                           
        host: 'localhost',                                                
        port: 6379,                                                       
      },                                                                  
    });                                                                   
                                                                          
    await client.connect();                                               
    await client.ping();                                                  
    await client.quit();                                                  
                                                                          
    return true;                                                          
  } catch (error) {                                                       
    console.error('Redis error:', error);                                 
    return false;                                                         
  }                                                                       
}

export function checkEnvironment(): { ok: boolean; missing: string[] } {          
  const requiredVars = ['DATABASE_URL'];                                          
  const missing = requiredVars.filter(varName => !process.env[varName]);          
                                                                                  
  return {                                                                        
    ok: missing.length === 0,                                                     
    missing,                                                                      
  };                                                                              
}