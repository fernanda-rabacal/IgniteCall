import { ArrowRight } from "phosphor-react";
import { Form, FormAnnotation } from "./styles";
import { TextInput, Button, Text } from "@ignite-ui/react"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Router, useRouter } from "next/router";

const claimUsernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Digite pelo menos três letras"})
    .regex(/^([a-z\\-]+)$/i, { message: "O usuário só pode ter letras e hífens"})
    .transform(username => username.toLowerCase())
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameSchema>

export function ClaimUsernameForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameSchema)
  })
  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data


    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput 
          size="sm" 
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size='sm' type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username && errors.username.message}
        </Text>
      </FormAnnotation>
    </>
  )
}