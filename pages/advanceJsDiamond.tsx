import importData from '../assets/exampleData.json'

export const getStaticProps = async () => {
  const data = importData
  return {
    props: {
      data,
    },
  }
}

interface data {
  id: string
  name: string
  msrp: string
  category: {
    highlevel: string
    lowlevel: string
  }
  forType: string
  features: {
    pros: string[]
    cons: string[]
  }
}

const advanceJsDiamond = ({ data }: any) => {
  const _items: object[] = []
  data.map((item: any) => {
    const arrOfObj = {
      id: item.id,
      productDescription: {
        name: item.name,
        category: `${item.category.highlevel} - ${item.forType} ${item.category.lowlevel}`,
        features: `The Pros: ${[...item.features.pros]} and The Cons: ${[
          ...item.features.cons,
        ]}`,
      },
      productPrice: {
        price: item.msrp,
      },
    }
    _items.push(arrOfObj)
  })

  console.log(_items)
  return (
    <div>
      <h1>Trying to transform data structures</h1>
    </div>
  )
}

export default advanceJsDiamond
