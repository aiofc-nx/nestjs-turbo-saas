import { RequestContext } from "@gauzy/core";
import { CreateCamshotDTO } from "../dtos/create-camshot.dto";
import { ICamshot } from '../models/camshot.model';

export class CamshotFactory {
	public static create(input: CreateCamshotDTO): Partial<ICamshot> {
		return {
			...input,
			...this.common(input)
		}
	}

	private static common(input: CreateCamshotDTO) {
		const tenantId = (input as any).tenantId || RequestContext.currentTenantId();
		const organizationId = (input as any).organizationId;
		const uploadedById = (input as any).uploadedById || RequestContext.currentEmployeeId();
		const userId = RequestContext.currentUserId();

		return {
			tenantId,
			organizationId,
			uploadedById,
			userId
		}
	}
}
