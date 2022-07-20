import log from 'loglevel'
import { Bus } from '@/helpers'
import { i18n } from '@/localization'
import {
  ProviderChainDisconnected,
  ProviderChainNotFoundError,
  ProviderDisconnected,
  ProviderInternalError,
  ProviderInvalidInput,
  ProviderInvalidParams,
  ProviderInvalidRequest,
  ProviderJsonRpcVersionNotSupported,
  ProviderLimitExceeded,
  ProviderMethodNotFound,
  ProviderMethodNotSupported,
  ProviderNotSupportedError,
  ProviderParseError,
  ProviderResourceNotFound,
  ProviderResourceUnavailable,
  ProviderTransactionRejected,
  ProviderUnauthorized,
  ProviderUnsupportedMethod,
  ProviderUserRejectedRequest,
  ProviderWrapperMethodNotFoundError,
} from '@/errors'

export class ErrorHandler {
  static process(error: Error | unknown, errorMessage = ''): void {
    const msgTranslation = errorMessage || ErrorHandler._getErrorMessage(error)
    Bus.error(msgTranslation)

    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback(error: Error | unknown): void {
    log.error(error)
  }

  static _getErrorMessage(error: Error | unknown): string {
    const { t } = i18n.global
    let errorMessage = ''

    if (error instanceof Error)
      switch (error.constructor) {
        case ProviderChainNotFoundError:
          errorMessage = t('errors.provider-chain-not-found-error')
          break
        case ProviderNotSupportedError:
          errorMessage = t('errors.provider-not-supported-error')
          break
        case ProviderUserRejectedRequest:
          errorMessage = t('errors.provider-user-rejected-request')
          break
        case ProviderUnauthorized:
          errorMessage = t('errors.provider-unauthorized')
          break
        case ProviderUnsupportedMethod:
          errorMessage = t('errors.provider-unsupported-method')
          break
        case ProviderDisconnected:
          errorMessage = t('errors.provider-disconnected')
          break
        case ProviderChainDisconnected:
          errorMessage = t('errors.provider-chain-disconnected')
          break
        case ProviderParseError:
          errorMessage = t('errors.provider-parse-error')
          break
        case ProviderInvalidRequest:
          errorMessage = t('errors.provider-invalid-request')
          break
        case ProviderMethodNotFound:
          errorMessage = t('errors.provider-method-not-found')
          break
        case ProviderInvalidParams:
          errorMessage = t('errors.provider-invalid-params')
          break
        case ProviderInternalError:
          errorMessage = t('errors.provider-internal-error')
          break
        case ProviderInvalidInput:
          errorMessage = t('errors.provider-invalid-input')
          break
        case ProviderResourceNotFound:
          errorMessage = t('errors.provider-resource-not-found')
          break
        case ProviderResourceUnavailable:
          errorMessage = t('errors.provider-resource-unavailable')
          break
        case ProviderTransactionRejected:
          errorMessage = t('errors.provider-transaction-rejected')
          break
        case ProviderMethodNotSupported:
          errorMessage = t('errors.provider-method-not-supported')
          break
        case ProviderLimitExceeded:
          errorMessage = t('errors.provider-limit-exceeded')
          break
        case ProviderJsonRpcVersionNotSupported:
          errorMessage = t('errors.provider-json-rpc-version-not-supported')
          break
        case ProviderWrapperMethodNotFoundError:
          errorMessage = t('errors.provider-wrapper-method-not-found')
          break
        default: {
          errorMessage = t('errors.default')
        }
      }

    return errorMessage
  }
}
