: string; textClass: string; cssVar?: string }) {
  return (
    <div className="flex flex-col">
      <div className={`h-24 rounded-lg ${className} flex items-center justify-center`}>
        <span className={`text-sm font-medium ${textClass}`}>{name}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {cssVar ? `hsl(var(${cssVar}))` : className}
      </p>
    </div>
  );
}
