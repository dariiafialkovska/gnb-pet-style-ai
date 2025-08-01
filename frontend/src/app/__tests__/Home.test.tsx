import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'
import { generateImageWithOpenAI } from '@/lib/api'

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:mocked-url')
  window.alert = jest.fn()
  window.open = jest.fn()
})

jest.mock('../components/Header', () => () => <div>MockHeader</div>)
jest.mock('../components/UploadSection', () => (props: any) => (
  <div>
    MockUploadSection
    <input type="file" onChange={props.handleFileChange} data-testid="file-input" />
    <button onClick={props.handleGenerate}>Generate</button>
  </div>
))
jest.mock('../components/FinalSection', () => () => <div>MockFinalSection</div>)
jest.mock('../components/LoadingPreview', () => () => <div>MockLoading</div>)

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
  },
}))

jest.mock('@/lib/api', () => ({
  generateImageWithOpenAI: jest.fn(),
}))

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

    // Mock file with size and valid type
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
    const { toast } = require('react-hot-toast')
    render(<Home />)

    const file = new File(['fail'], 'bad.txt', { type: 'text/plain' })
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    })

    expect(toast.error).toHaveBeenCalledWith('Only PNG and JPEG files are allowed.')
  })

  it('shows toast on large file', () => {
    const { toast } = require('react-hot-toast')
    render(<Home />)

    const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'big.jpg', {
      type: 'image/jpeg',
    })
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 }) // 11MB

    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [largeFile] },
    })

    expect(toast.error).toHaveBeenCalledWith('Image size must be less than 10MB.')
  })
})
