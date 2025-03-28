import { users, type User, type InsertUser, type ContactRequest, type InsertContactRequest } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactRequest(contactRequest: InsertContactRequest): Promise<ContactRequest>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactRequests: Map<number, ContactRequest>;
  currentUserId: number;
  currentContactRequestId: number;

  constructor() {
    this.users = new Map();
    this.contactRequests = new Map();
    this.currentUserId = 1;
    this.currentContactRequestId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createContactRequest(insertContactRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = this.currentContactRequestId++;
    const contactRequest: ContactRequest = { 
      ...insertContactRequest, 
      id,
      phone: insertContactRequest.phone || null,
      created_at: new Date() 
    };
    this.contactRequests.set(id, contactRequest);
    console.log(`Contact request created: ${JSON.stringify(contactRequest)}`);
    return contactRequest;
  }
}

export const storage = new MemStorage();
