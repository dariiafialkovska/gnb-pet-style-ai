import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FinalSection from '../components/FinalSection'

const previewUrl = 'https://example.com/preview.jpg'
const aiImage = 'https://example.com/ai.jpg'

describe('FinalSection', () => {
  const setSliderValue = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders default view with after image', () => {
    render(
      <FinalSection
        previewUrl={previewUrl}
        aiImage={aiImage}
        sliderValue={50}
        setSliderValue={setSliderValue}
      />
    )

    const img = screen.getByAltText('Styled Result') as HTMLImageElement
    expect(img.src).toBe(aiImage)
    expect(screen.getByText('After')).toHaveClass('bg-[#e1efe6]')
  })

  it('toggles to before image when clicking Before', () => {
    render(
      <FinalSection
        previewUrl={previewUrl}
        aiImage={aiImage}
        sliderValue={50}
        setSliderValue={setSliderValue}
      />
    )

    fireEvent.click(screen.getByText('Before'))
    const img = screen.getByAltText('Styled Result') as HTMLImageElement
    expect(img.src).toBe(previewUrl)
  })

  it('clicking Download fetches image', async () => {
    const blob = new Blob(['dummy'], { type: 'image/png' })
    global.fetch = jest.fn().mockResolvedValueOnce({ blob: () => Promise.resolve(blob) }) as any

    render(
      <FinalSection
        previewUrl={previewUrl}
        aiImage={aiImage}
        sliderValue={50}
        setSliderValue={setSliderValue}
      />
    )

    const downloadBtn = screen.getByText('Download')
    fireEvent.click(downloadBtn)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(aiImage)
    })
  })

  it('clicking Facebook opens share window', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    render(
      <FinalSection
        previewUrl={previewUrl}
        aiImage={aiImage}
        sliderValue={50}
        setSliderValue={setSliderValue}
      />
    )

    fireEvent.click(screen.getByText('Post to Facebook'))
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com/sharer/sharer.php'),
      '_blank',
      expect.stringContaining('width=600')
    )

    openSpy.mockRestore()
  })

  it('clicking Instagram copies text and opens Instagram', async () => {
    const clipboardWrite = jest.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText: clipboardWrite } })

    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    render(
      <FinalSection
        previewUrl={previewUrl}
        aiImage={aiImage}
        sliderValue={50}
        setSliderValue={setSliderValue}
      />
    )

    fireEvent.click(screen.getByText('Post to Instagram'))

    await waitFor(() => {
      expect(clipboardWrite).toHaveBeenCalled()
      expect(openSpy).toHaveBeenCalledWith('https://www.instagram.com/', '_blank')
    })

    openSpy.mockRestore()
  })
})
