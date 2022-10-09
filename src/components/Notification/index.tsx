import clsx from "clsx"
import { ReactNode } from "react"

interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
  text: string | ReactNode
}

export default function Notification({
  type = 'info',
  text
}: Props) {



  return <div className={
    clsx("notification", {
      'is-info': type === 'info',
      'is-success': type === 'success',
      'is-warning': type === 'warning',
      'is-danger': type === 'error'
    })
  }>
    <button className="delete"></button>
    {text}
  </div>
}
