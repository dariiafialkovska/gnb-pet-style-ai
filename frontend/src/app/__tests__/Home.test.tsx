import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'
import { generateImageWithOpenAI } from '@/lib/api'
import { toast } from 'react-hot-toast' // ✅ FIXED require()
jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
  },
}))

jest.mock('@/lib/api', () => ({
  generateImageWithOpenAI: jest.fn(),
}))

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:mocked-url')
  window.alert = jest.fn()
  window.open = jest.fn()
})

// Mock: Header
jest.mock('../components/Header', () => {
  const MockHeader = () => <div>MockHeader</div>
  MockHeader.displayName = 'MockHeader'
  return MockHeader
})

// Mock: UploadSection
jest.mock('../components/UploadSection', () => {
  const MockUploadSection = ({
    handleFileChange,
    handleGenerate,
  }: {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleGenerate: () => void
  }) => (
    <div>
      MockUploadSection
      <input type="file" onChange={handleFileChange} data-testid="file-input" />
      <button onClick={handleGenerate}>Generate</button>
    </div>
  )
  MockUploadSection.displayName = 'MockUploadSection'
  return MockUploadSection
})

// Mock: FinalSection
jest.mock('../components/FinalSection', () => {
  const MockFinalSection = () => <div>MockFinalSection</div>
  MockFinalSection.displayName = 'MockFinalSection'
  return MockFinalSection
})

// Mock: LoadingPreview
jest.mock('../components/LoadingPreview', () => {
  const MockLoading = () => <div>MockLoading</div>
  MockLoading.displayName = 'MockLoading'
  return MockLoading
})

describe('Home page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload section by default', () => {
    render(<Home />)
    expect(screen.getByText('MockUploadSection')).toBeInTheDocument()
  })

  it('shows loading and then result after generate', async () => {
    (generateImageWithOpenAI as jest.Mock).mockResolvedValue('https://example.com/ai.jpg')
    render(<Home />)

    const file = new File(['dummy'], 'dog.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    })

    fireEvent.click(screen.getByText('Generate'))

    await waitFor(() => {
      expect(screen.getByText('MockLoading')).toBeInTheDocument()
    })

    expect(await screen.findByText('MockFinalSection')).toBeInTheDocument()
  })

  it('shows toast on invalid file type', () => {
    render(<Home />)

    const file = new File(['fail'], 'bad.txt', { type: 'text/plain' })
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    })

    expect(toast.error).toHaveBeenCalledWith('Only PNG and JPEG files are allowed.')
  })

  it('shows toast on large file', () => {
    render(<Home />)

    const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'big.jpg', {
      type: 'image/jpeg',
    })
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 })

    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [largeFile] },
    })

    expect(toast.error).toHaveBeenCalledWith('Image size must be less than 10MB.')
  })
})
