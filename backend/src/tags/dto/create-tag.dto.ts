import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: 'Tag name is required' })
  @IsString()
  @MaxLength(100)
  name: string;
}
