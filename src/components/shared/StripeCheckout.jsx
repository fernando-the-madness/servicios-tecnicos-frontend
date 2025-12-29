// frontend/src/components/shared/StripeCheckout.jsx
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

export default function StripeCheckout({ amount }) {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    })
    if (error) return alert(error.message)
    alert('¡Pago exitoso!')
  }

  return (
    <Elements stripe={stripePromise}>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit">Pagar ${amount / 100}</button>
      </form>
    </Elements>
  )
}