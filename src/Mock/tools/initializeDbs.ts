import Chance from 'chance'

import { clearDbs, peopleDB, skillsDB, user } from '..'
import generateId from './generateId'
import { Skill } from '../../Types/Skill'
import { Person, UserSkill } from '../../Types/Person'

const chance = new Chance()

const mockSkills = [
  'Java', 'PHP', 'Laravel', 'Django',
  'Javascript', 'Nodejs', 'Python', 'SQL',
  'AWS', 'HTML', 'CSS', 'Reactjs',
  'NextJS', '.NET', 'C', 'C#',
  'C++', 'Database', 'S3', 'EC2',
  'Lambda','Bedrock','IOT','API Gateway',
  'Spark', 'Vue', 'Angular',
]

const initializeDbs = () => {
  clearDbs()

  mockSkills.forEach(entry => {
    skillsDB.add({
      id: generateId(),
      name: entry,
      description: chance.sentence()
    } as Skill)
  })

  const numPeople = chance.integer({ min: 15, max: 30 })

  for (let j = 0; j < numPeople; j++) {
    const name = chance.name()

    const userSkills = skillsDB.list().map(skill => {
      const rating = chance.integer({min: 0, max: 4})

      return {
        name: skill.name,
        id: skill.id,
        rating
      } as UserSkill
    })

    const topSkill = userSkills.toSorted((a, b) => a.rating < b.rating ? 1 : -1)[0]

    const person = {id: generateId(), name, skills: userSkills, topSkill: topSkill} as Person

    peopleDB.add(person)
  }

  const signedInUser = {
    name: chance.name(),
    id: generateId(),
  } as Person

  user.add(signedInUser)
}

export default initializeDbs
