import { Entry } from "./Entry"

export type Skill = Entry & NewSkillObj

export type NewSkillObj = {
    name: string,
    description: string
}