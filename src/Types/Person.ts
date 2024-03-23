import { Entry } from "./Entry"
import { Skill } from "./Skill"

export type UserSkill = Entry & Skill & {
    rating: 0|1|2|3|4
}

export type Person = Entry & {
    name: string,
    skills: UserSkill[],
    topSkill?: UserSkill,
}