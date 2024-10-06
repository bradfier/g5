import { Component, createResource, createSignal } from 'solid-js'
import { createDropzone } from '@soorria/solid-dropzone'
import Dropzone from './Dropzone'
import { ErrorAlert } from './ErrorAlert'
import { processCsv } from './processCsv'

const App: Component = () => {
  const [error, setError] = createSignal<string | undefined>()
  const [file, setFile] = createSignal<File | undefined>()
  const onDrop = (acceptedFiles: File[]) => {
    setError(null)
    setFile(acceptedFiles[0])
  }
  const processFile = async (file: File) => {
    try {
      await processCsv(file)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Unknown error')
      }
    }
  }
  // Use a resource to drive processFile on change, but don't use the result as the download is a side effect of
  // processCsv for now.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_processed] = createResource(file, processFile)

  const dropzone = createDropzone({ onDrop, maxFiles: 1 })

  return (
    <div class="container mx-auto max-w-2xl">
      <div class="px-8">
        <p class="text-4xl text-blue-800 text-center py-8">G5 Logfile Linter</p>
        <p class="text-center">
          Fixes GPS date rollover and bogus default Lat/Long coordinates in your log
          files.
        </p>
        {error() && (
          <ErrorAlert>
            <p>{error()}</p>
          </ErrorAlert>
        )}
        <Dropzone
          className={'py-4'}
          rootProps={dropzone.getRootProps()}
          inputProps={dropzone.getInputProps()}
        />
      </div>
    </div>
  )
}

export default App
