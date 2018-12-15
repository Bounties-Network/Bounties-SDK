import { DjangoListResponse } from '../../utils/types'
import { User } from '../User/types'

export interface Comment {
    id: number,
    user: User,
    created: string,
    modified: string,
    text: string,
}

export type CommentsResponse = DjangoListResponse<Comment>