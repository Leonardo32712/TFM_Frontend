

export const logInControllerErrorHandler = ((error: any): string => {
  const errorCode = error.code as string;
  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'Las credenciales ingresadas son incorrectas.'
    case 'auth/invalid-email':
      return 'El correo electrónico ingresado no es válido.'
    case 'auth/missing-password':
      return 'La contraseña no ha sido introducida'
    default:
      return 'Ha ocurrido un error al intentar iniciar sesión. Por favor, intentalo de nuevo más tarde.'
  }
})

export const signUpControllerErrorHandler = ((error: any): string => {
  const errorCode = (error as any).error.code;
  switch (errorCode) {
    case 'backend/invalid-email':
      return 'El correo introducido no tiene un formato válido.'
    case 'auth/invalid-password':
      return 'La contraseña debe tener al menos 6 caracteres.'
    case 'auth/email-already-exists':
      return 'El correo introducido pertenece a una cuenta existente.'
    default:
      return 'Ha ocurrido un error al intentar registrar su usuario. Por favor, inténtelo de nuevo más tarde.'
  }
})

export const deleteAccountErrorHandler = ((error: any): string => {
  console.log(error)
  const errorCode = (error as any).error.code;
  switch (errorCode) {
    default:
      return 'Ha ocurrido un error inesperado al intentar eliminar su cuenta.'
  }
})