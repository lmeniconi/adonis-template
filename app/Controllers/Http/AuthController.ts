import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'

import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const { email, password } = request.all()

    let user = await User.findBy('email', email)
    if (user) return response.badRequest({ error: 'User already exists' })

    await User.create({ email, password })
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.all()

    const user = await User.query().where('email', email).first()
    if (!user) return response.badRequest({ error: 'Invalid credentials' })

    if (!(await Hash.verify(user.password, password)))
      return response.badRequest('Invalid credentials')

    await auth.login(user)
  }

  public async me({ auth }: HttpContextContract) {
    return auth.user
  }
}
