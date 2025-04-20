import { find, create } from '../models/User.js';

export function getAllUsers() { return find(); }

export function createUser(userData) { return create(userData); }
