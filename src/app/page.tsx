import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl text-white font-bold">O</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">OpenSeat</h1>
        <p className="text-text-secondary mt-2">
          Tu asiento libre te está esperando
        </p>
      </div>

      {/* Descripción */}
      <p className="text-text-secondary max-w-sm mb-10">
        Carpooling exclusivo para tu comunidad. Compartí viajes con gente
        verificada y conocé personas nuevas.
      </p>

      {/* Botones */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/login" className="btn-primary text-center">
          Iniciar sesión
        </Link>
        <Link href="/register" className="btn-secondary text-center">
          Crear cuenta
        </Link>
      </div>

      {/* Footer */}
      <p className="text-text-tertiary text-xs mt-12">
        Verificado por tu universidad
      </p>
    </div>
  );
}
