import type { UserProfile } from '../types';
import usersJson from './users.json';

// JSON imports infer `string` for union fields, so narrow to the domain type.
export const users = usersJson as UserProfile[];
