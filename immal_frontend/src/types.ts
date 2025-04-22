export interface UserResponse {
    user: {
      id: string;
      email: string;
      username: string;
      is_active: boolean;
      created: Date;
      updated: Date;
    };
    access: string;
    refresh: string;
  }


  export interface Account {
    id: string;
    email: string;
    username: string;
    is_active: boolean;
    created: Date;
    updated: Date;
    birthdate?:string;
    country?:string;
    diseases?:string[];
  }

  
