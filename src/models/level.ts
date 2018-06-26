import { Character } from './character';
import { Image } from './image';

export class Level {
    id: number;
    difficulty: number;
    answer: Character[];
    image: Image;
}