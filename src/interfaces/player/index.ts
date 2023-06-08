import { AcademyInterface } from 'interfaces/academy';
import { UserInterface } from 'interfaces/user';

export interface PlayerInterface {
  id?: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  position: string;
  academy_id: string;
  parent_id: string;
  created_at?: Date;
  updated_at?: Date;

  academy?: AcademyInterface;
  user?: UserInterface;
  _count?: {};
}
