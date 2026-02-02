import js from '@eslint/js';                                                                   
  import tsParser from '@typescript-eslint/parser';                                              
  import tsPlugin from '@typescript-eslint/eslint-plugin';                                       
  import prettier from 'eslint-config-prettier';                                                 
                                                                                                 
  export default [                                                                               
    // Ignore files                                                                              
    {                                                                                            
      ignores: [                                                                                 
        'node_modules/**',                                                                       
        'dist/**',                                                                               
        'build/**',                                                                              
        'coverage/**',                                                                           
        '*.config.js',                                                                           
        '.next/**',                                                                              
      ],                                                                                         
    },                                                                                           
    // Base JS rules                                                                             
    js.configs.recommended,                                                                      
    // TypeScript rules                                                                          
    {                                                                                            
      files: ['**/*.ts', '**/*.tsx'],                                                            
      languageOptions: {                                                                         
        parser: tsParser,                                                                        
        parserOptions: {                                                                         
          ecmaVersion: 2022,                                                                     
          sourceType: 'module',                                                                  
        },                                                                                       
      },                                                                                         
      plugins: {                                                                                 
        '@typescript-eslint': tsPlugin,                                                          
      },                                                                                         
      rules: {                                                                                   
        ...tsPlugin.configs.recommended.rules,                                                   
        '@typescript-eslint/no-unused-vars': 'error',                                            
        '@typescript-eslint/no-explicit-any': 'warn',                                            
      },                                                                                         
    },                                                                                           
    // Prettier config (must be last)                                                            
    prettier,                                                                                    
  ];