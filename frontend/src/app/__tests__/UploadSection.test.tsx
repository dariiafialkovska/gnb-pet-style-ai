import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UploadSection from '../components/UploadSection'

describe('UploadSection', () => {
  const mockHandleFileChange = jest.fn()
  const mockHandleGenerate = jest.fn()
  const mockSetScenario = jest.fn()
  const mockSetClothing = jest.fn()

  const baseProps = {
    file: null,
    previewUrl: null,
    handleFileChange: mockHandleFileChange,
    handleGenerate: mockHandleGenerate,
    selectedScenario: '',
    setSelectedScenario: mockSetScenario,
    selectedClothing: '',
    setSelectedClothing: mockSetClothing,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload prompt and calls file change handler', async () => {
    render(<UploadSection {...baseProps} />)
    const fileInput = screen.getByLabelText(/click or drag to upload/i)
    const file = new File(['dummy'], 'dog.png', { type: 'image/png' })

    await userEvent.upload(fileInput, file)

    expect(mockHandleFileChange).toHaveBeenCalled()
  })

  it('renders scenario buttons and triggers setter', () => {
    render(<UploadSection {...baseProps} />)
    const button = screen.getByText('Lavender Chill Evening')
    fireEvent.click(button)
    expect(mockSetScenario).toHaveBeenCalledWith('Lavender Chill Evening')
  })

  it('renders clothing buttons and triggers setter', () => {
    render(<UploadSection {...baseProps} />)
    const button = screen.getByText('Poncho')
    fireEvent.click(button)
    expect(mockSetClothing).toHaveBeenCalledWith('Poncho')
  })

  it('shows example carousel when previewUrl is null', () => {
    render(<UploadSection {...baseProps} />)
    expect(screen.getByText(/upload a photo of your dog/i)).toBeInTheDocument()
  })

  it('shows preview image and generate button when previewUrl exists', () => {
    render(
      <UploadSection
        {...baseProps}
        previewUrl="https://example.com/dog.jpg"
      />
    )
    expect(screen.getByAltText('Preview')).toBeInTheDocument()
    expect(screen.getByText('Generate GNB Look')).toBeInTheDocument()
  })

  it('calls handleGenerate when clicking generate', () => {
    render(
      <UploadSection
        {...baseProps}
        previewUrl="https://example.com/dog.jpg"
      />
    )
    fireEvent.click(screen.getByText('Generate GNB Look'))
    expect(mockHandleGenerate).toHaveBeenCalled()
  })
})
