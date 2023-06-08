import { AcademyUserInterface } from 'interfaces/academy-user';
import { PlayerInterface } from 'interfaces/player';
import { UserInterface } from 'interfaces/user';

export interface AcademyInterface {
  id?: string;
  name: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  academy_user?: AcademyUserInterface[];
  player?: PlayerInterface[];
  user?: UserInterface;
  _count?: {
    academy_user?: number;
    player?: number;
  };
}
