import { Container, Form, FormError, Header } from "./styles";
import { Heading, Text, MultiStep, TextInput, Button } from "@ignite-ui/react"
import { ArrowRight } from "phosphor-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from "@/lib/axios";
import { AxiosError } from "axios"

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Digite pelo menos três letras"})
    .regex(/^([a-z\\-]+)$/i, { message: "O usuário só pode ter letras e hífens"})
    .transform(username => username.toLowerCase()),
    name: z
    .string()
    .min(3, { message: "Digite pelo menos três letras"})
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema)
  })

  const router = useRouter()

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username
      })

      await router.push('/register/connect-calendar')
    } catch(err) {
      if(err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
      }

      console.error(err)
    }
  }

  useEffect(() => {
    if(router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue]) 

  return(
    <Container>
      <Header>
        <Heading as="strong">Bem vindo ao Ignite Call</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil!
           Ah, você pode editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1}/>
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome do usuário</Text>
          <TextInput 
            prefix="ignite.com/" 
            placeholder="seu-usuario" 
            {...register("username")}
            />
            {errors.username && <FormError size="sm">{errors.username.message}</FormError>}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput 
            placeholder="Seu nome" 
            {...register("name")}
            />
            {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
        </label>

        <Button disabled={isSubmitting}>
          Próximo passo

          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
