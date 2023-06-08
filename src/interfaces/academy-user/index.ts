import { AcademyInterface } from 'interfaces/academy';
import { UserInterface } from 'interfaces/user';

export interface AcademyUserInterface {
  id?: string;
  academy_id: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;

  academy?: AcademyInterface;
  user?: UserInterface;
  _count?: {};
}
