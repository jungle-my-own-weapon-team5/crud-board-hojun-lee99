import { useState } from 'react'
import './App.css'
import LoginPage from './LoginPage'
import PostListPage from './PostListPage'
import RegisterPage from './RegisterPage'
import PostCreatePage from './PostCreatePage'

type Page = 'list' | 'create'

function App() {
  const [page, setPage] = useState<Page>('list')
  
  if (page === 'create') {
    return (
      <PostCreatePage
        onCreated={() => setPage('list')}
        onCancel={() => setPage('list')}
      />
    )
  }
  return <PostListPage onCreateClick={() => setPage('create')} />
}

export default App
