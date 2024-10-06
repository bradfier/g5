import { ClassValue } from 'clsx'
import { cn } from './utils'
import { ComponentProps } from 'solid-js'

const Dropzone = ({
  className,
  rootProps,
  inputProps
}: {
  className?: ClassValue
  rootProps: ComponentProps<'div'>
  inputProps: ComponentProps<'input'>
}) => {
  return (
    <div class="flex flex-row justify-center">
      <div class={cn('max-w-xl flex-grow', className)} {...rootProps}>
        <label class="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
          <span class="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span class="font-medium text-gray-600">
              Drop files to upload, or <span class="text-blue-600 underline">browse</span>
            </span>
          </span>
          <input {...inputProps} />
        </label>
      </div>
    </div>
  )
}

export default Dropzone
