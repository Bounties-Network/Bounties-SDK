import { BaseResource } from '../base'
import Bounties from '../../bounties';
import { DjangoListQueryParams, DjangoListResponse } from '../../utils/types'
import { Category } from './types'

export class CategoriesResource extends BaseResource {
    constructor(bounties: Bounties) {
        super(bounties)
    }

    list(params?: DjangoListQueryParams): Promise<DjangoListResponse<Category>> {
        return this.request.get('category/', params)
    }
}