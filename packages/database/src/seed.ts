import { db } from './index';                                                                  
  import { users } from './schema';                                                              
                                                                                                 
  async function seed() {                                                                        
    console.log('Seeding database...');                                                       
    await db.insert(users).values([                                                              
      { email: 'alice@example.com', name: 'Alice' },                                             
      { email: 'bob@example.com', name: 'Bob' },                                                 
      { email: 'charlie@example.com', name: 'Charlie' },                                         
    ]);                                                                                          
    console.log('Seed complete!');                                                        
    process.exit(0);                                                                             
  }                                                                                              
                                                                                                 
  seed().catch((err) => {                                                                        
    console.error('Seed failed:', err);                                                       
    process.exit(1);                                                                           
  });
