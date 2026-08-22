import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export function EntityFormFields({ fields, value, onChange }) {
  function setField(name, fieldValue) {
    onChange({ ...value, [name]: fieldValue })
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={cn('space-y-1.5', field.span === 2 && 'sm:col-span-2')}>
          <Label htmlFor={field.name}>
            {field.label}
            {field.required ? <span className="text-destructive"> *</span> : null}
          </Label>

          {field.type === 'select' ? (
            <Select
              value={value[field.name] != null ? String(value[field.name]) : ''}
              onValueChange={(next) => setField(field.name, next)}
              disabled={field.disabled}
            >
              <SelectTrigger id={field.name} className="w-full">
                <SelectValue placeholder={field.placeholder ?? 'Selecciona...'} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === 'textarea' ? (
            <Textarea
              id={field.name}
              value={value[field.name] ?? ''}
              onChange={(event) => setField(field.name, event.target.value)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              rows={field.rows ?? 3}
            />
          ) : (
            <Input
              id={field.name}
              type={field.type ?? 'text'}
              value={value[field.name] ?? ''}
              onChange={(event) =>
                setField(field.name, field.type === 'number' ? event.target.value : event.target.value)
              }
              placeholder={field.placeholder}
              disabled={field.disabled}
              step={field.type === 'number' ? (field.step ?? 'any') : undefined}
            />
          )}

          {field.hint ? <p className="text-muted-foreground text-xs">{field.hint}</p> : null}
        </div>
      ))}
    </div>
  )
}
