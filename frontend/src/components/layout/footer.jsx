export function Footer({ disclaimer }) {
  return (
    <footer className="w-full border-t bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="border-2 border-destructive/30 rounded-lg bg-destructive/5 p-4 mb-4">
          <p className="text-xs text-destructive font-bold leading-relaxed">
            {disclaimer || "Avertissement légal : les modèles fournis sont indicatifs et n'ont pas été révisés par un avocat."}
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Contraty. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
