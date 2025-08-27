import './Button.scss'

const Button = (props) => {
  const {
    className,
    type,
    onClick,
    children,
  } = props

  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button