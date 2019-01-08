import { Iterable } from "@reactivex/ix-es5-cjs";
import { map, filter, flatMap } from '@reactivex/ix-es5-cjs/iterable/pipe/index';

interface IHavePoint {
	point: {
		id: string
		point?: {
			tag: string // Alias to external keys on terminal points
		}
	}
}

export interface IEvent extends IHavePoint {
	timestamp: number
	operatorId: string // Alias
	parent?: IEvent
	value: string // Alias
	srcIdentityId: string // Alias
	customer?: {
		customer: {
			name
			aggreementGuid: string // Alias
		}
	}
}

export interface IInterval extends IHavePoint {
	startTime: number
	endTime: number
	endEvent: IEvent
	intervalEventTree?: {
		list?: IInterval[]
		events?: IEvent[]
	}
}

/** Flattens the interval tree to a list similar to the one read from BossId */
export const parseTree = (list: IInterval[], fractionCode: string): Iterable<SourceContracts.IFlatIntervalTree> =>
	Iterable.from(list).pipe(
		flatMap(contInterval => Iterable.from(contInterval.intervalEventTree.list).pipe(
			flatMap(valveInterval => Iterable.from(valveInterval.intervalEventTree.events.length ? valveInterval.intervalEventTree.events : [<IEvent>{customer: {customer: {aggreementGuid: null}}}]).pipe(
				map(event => <SourceContracts.IFlatIntervalTree>{
					containerTag: contInterval.endEvent.parent.point.point.tag,
					containerTimestampIso: new Date(contInterval.endTime).toISOString(), // Same as endEvent.timestamp
					fractionCode,
					valveBossIdId: valveInterval.point.id,
					valveTimestampIso: new Date(valveInterval.endTime).toISOString(),
					customerEventAgreementGuid: event.customer.customer.aggreementGuid,
					customerEventTimestampIso: event.timestamp ? new Date(event.timestamp).toISOString() : null,
					customerEventIdentityIdentifier: event.srcIdentityId,
					customerEventOperatorId: event.operatorId,
					customerEventValue: event.value,
				})
			))
		))
	)
