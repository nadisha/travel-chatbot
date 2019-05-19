import { Avatar } from './avatar';

export class Message {
    public content: string;
    public timestamp: Date;
    public avatarImg: string;
    public isHuman: boolean;

    constructor(content: string, isHuman: boolean, timestamp?: Date) {
        this.content = content;
        this.timestamp = timestamp;
        this.isHuman = isHuman;
        this.avatarImg = isHuman ? Avatar.HUMAN : Avatar.ROBOT;
    }
}
