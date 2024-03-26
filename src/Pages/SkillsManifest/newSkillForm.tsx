import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NewSkillObj } from "@/Types"

interface NewSkillFormProps {
    onSubmit: (data: NewSkillObj) => void,
    close: () => void,
    validateName: (field: string) => string | undefined
}

const NewSkillForm: React.FC<NewSkillFormProps> = ({ onSubmit, close, validateName }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<NewSkillObj>();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='py-4'>
                <Label className='font-bold'>
                    <span>
                        Name
                    </span>
                    <span className='text-red-600'>
                        {errors?.name ? '*' : ''} {errors?.name?.message}
                    </span>
                </Label>
                <Input className={`mb-2 ${errors?.name ? 'border-2 border-red-600' : 'border-black'}`} {...register('name', { validate: validateName, required: true })} />
                <Label className='font-bold'>
                    <span>
                        Description
                    </span>
                    <span className='text-red-600'>
                        {errors?.description ? '*' : ''}
                    </span>
                </Label>
                <Input className={`mb-2 ${errors?.description ? 'border-2 border-red-600' : 'border-black'}`} {...register('description', { required: true })} />
            </div>
            <div className='justify-between grid grid-cols-4'>
                <Button className='font-bold' onClick={close}>Cancel</Button>
                <div className='col-span-2' />
                <Button type='submit' className='bg-green-600 font-bold'>Add</Button>
            </div>
        </form>
    )
}

export default NewSkillForm
