import { ColorThemeKind, ThemeColor, ThemeIcon, Uri, window } from 'vscode';
import { Schemes } from '../../constants';
import type { Colors } from '../../constants.colors';
import type { Container } from '../../container';
import type { RepositoryIdentityDescriptor } from '../../gk/models/repositoryIdentities';
import type { ProviderReference } from './remoteProvider';
import type { Repository } from './repository';

export type IssueOrPullRequestType = 'issue' | 'pullrequest';
export type IssueOrPullRequestState = 'opened' | 'closed' | 'merged';
export enum RepositoryAccessLevel {
	Admin = 100,
	Maintain = 40,
	Write = 30,
	Triage = 20,
	Read = 10,
	None = 0,
}

export interface IssueOrPullRequest {
	readonly type: IssueOrPullRequestType;
	readonly provider: ProviderReference;
	readonly id: string;
	readonly nodeId: string | undefined;
	readonly title: string;
	readonly url: string;
	readonly createdDate: Date;
	readonly updatedDate: Date;
	readonly closedDate?: Date;
	readonly closed: boolean;
	readonly state: IssueOrPullRequestState;
	readonly commentsCount?: number;
	readonly thumbsUpCount?: number;
}

export interface IssueLabel {
	color?: string;
	name: string;
}

export interface IssueMember {
	id: string;
	name: string;
	avatarUrl?: string;
	url?: string;
}

export interface IssueRepository {
	owner: string;
	repo: string;
	accessLevel?: RepositoryAccessLevel;
	url?: string;
}

export interface IssueShape extends IssueOrPullRequest {
	author: IssueMember;
	assignees: IssueMember[];
	repository?: IssueRepository;
	labels?: IssueLabel[];
	body?: string;
}

export interface SearchedIssue {
	issue: IssueShape;
	reasons: string[];
}

export function serializeIssueOrPullRequest(value: IssueOrPullRequest): IssueOrPullRequest {
	const serialized: IssueOrPullRequest = {
		type: value.type,
		provider: {
			id: value.provider.id,
			name: value.provider.name,
			domain: value.provider.domain,
			icon: value.provider.icon,
		},
		id: value.id,
		nodeId: value.nodeId,
		title: value.title,
		url: value.url,
		createdDate: value.createdDate,
		updatedDate: value.updatedDate,
		closedDate: value.closedDate,
		closed: value.closed,
		state: value.state,
	};
	return serialized;
}

export function getIssueOrPullRequestHtmlIcon(issue?: IssueOrPullRequest): string {
	if (issue == null) {
		return `<span class="codicon codicon-link" style="color:${
			window.activeColorTheme.kind === ColorThemeKind.Dark ? '#a371f7' : '#8250df'
		};"></span>`;
	}

	if (issue.type === 'pullrequest') {
		switch (issue.state) {
			case 'merged':
				return `<span class="codicon codicon-git-merge" style="color:${
					window.activeColorTheme.kind === ColorThemeKind.Dark ? '#a371f7' : '#8250df'
				};"></span>`;
			case 'closed':
				return `<span class="codicon codicon-git-pull-request-closed" style="color:${
					window.activeColorTheme.kind === ColorThemeKind.Dark ? '#f85149' : '#cf222e'
				};"></span>`;
			case 'opened':
				return `<span class="codicon codicon-git-pull-request" style="color:${
					window.activeColorTheme.kind === ColorThemeKind.Dark ? '#3fb950' : '#1a7f37'
				};"></span>`;
			default:
				return `<span class="codicon codicon-git-pull-request"></span>`;
		}
	} else {
		if (issue.closed) {
			return `<span class="codicon codicon-pass" style="color:${
				window.activeColorTheme.kind === ColorThemeKind.Dark ? '#a371f7' : '#8250df'
			};"></span>`;
		}
		return `<span class="codicon codicon-issues" style="color:${
			window.activeColorTheme.kind === ColorThemeKind.Dark ? '#3fb950' : '#1a7f37'
		};"></span>`;
	}
}

export function getIssueOrPullRequestMarkdownIcon(issue?: IssueOrPullRequest): string {
	if (issue == null) {
		return `<span style="color:${
			window.activeColorTheme.kind === ColorThemeKind.Dark ? '#a371f7' : '#8250df'
		};">$(link)</span>`;
	}

	if (issue.type === 'pullrequest') {
		switch (issue.state) {
			case 'merged':
				return `<span style="color:${
					window.activeColorTheme.kind === ColorThemeKind.Dark ? '#a371f7' : '#8250df'
				};">$(git-merge)</span>`;
			case 'closed':
				return `<span style="color:${
					window.activeColorTheme.kind === ColorThemeKind.Dark ? '#f85149' : '#cf222e'
				};">$(git-pull-request-closed)</span>`;
			case 'opened':
				return `<span style="color:${
					window.activeColorTheme.kind === ColorThemeKind.Dark ? '#3fb950' : '#1a7f37'
				};">$(git-pull-request)</span>`;
			default:
				return `$(git-pull-request)`;
		}
	} else {
		if (issue.closed) {
			return `<span style="color:${
				window.activeColorTheme.kind === ColorThemeKind.Dark ? '#a371f7' : '#8250df'
			};">$(pass)</span>`;
		}
		return `<span style="color:${
			window.activeColorTheme.kind === ColorThemeKind.Dark ? '#3fb950' : '#1a7f37'
		};">$(issues)</span>`;
	}
}

export function getIssueOrPullRequestThemeIcon(issue?: IssueOrPullRequest): ThemeIcon {
	if (issue == null) {
		return new ThemeIcon('link', new ThemeColor('gitlens.closedAutolinkedIssueIconColor' satisfies Colors));
	}

	if (issue.type === 'pullrequest') {
		switch (issue.state) {
			case 'merged':
				return new ThemeIcon(
					'git-merge',
					new ThemeColor('gitlens.mergedPullRequestIconColor' satisfies Colors),
				);
			case 'closed':
				return new ThemeIcon(
					'git-pull-request-closed',
					new ThemeColor('gitlens.closedPullRequestIconColor' satisfies Colors),
				);
			case 'opened':
				return new ThemeIcon(
					'git-pull-request',
					new ThemeColor('gitlens.openPullRequestIconColor' satisfies Colors),
				);
			default:
				return new ThemeIcon('git-pull-request');
		}
	} else {
		if (issue.closed) {
			return new ThemeIcon('pass', new ThemeColor('gitlens.closedAutolinkedIssueIconColor' satisfies Colors));
		}
		return new ThemeIcon('issues', new ThemeColor('gitlens.openAutolinkedIssueIconColor' satisfies Colors));
	}
}

export function serializeIssue(value: IssueShape): IssueShape {
	const serialized: IssueShape = {
		type: value.type,
		provider: {
			id: value.provider.id,
			name: value.provider.name,
			domain: value.provider.domain,
			icon: value.provider.icon,
		},
		id: value.id,
		nodeId: value.nodeId,
		title: value.title,
		url: value.url,
		createdDate: value.createdDate,
		updatedDate: value.updatedDate,
		closedDate: value.closedDate,
		closed: value.closed,
		state: value.state,
		author: {
			id: value.author.id,
			name: value.author.name,
			avatarUrl: value.author.avatarUrl,
			url: value.author.url,
		},
		repository:
			value.repository == null
				? undefined
				: {
						owner: value.repository.owner,
						repo: value.repository.repo,
						url: value.repository.url,
				  },
		assignees: value.assignees.map(assignee => ({
			id: assignee.id,
			name: assignee.name,
			avatarUrl: assignee.avatarUrl,
			url: assignee.url,
		})),
		labels:
			value.labels == null
				? undefined
				: value.labels.map(label => ({
						color: label.color,
						name: label.name,
				  })),
		commentsCount: value.commentsCount,
		thumbsUpCount: value.thumbsUpCount,
		body: value.body,
	};
	return serialized;
}

export class Issue implements IssueShape {
	readonly type = 'issue';

	constructor(
		public readonly provider: ProviderReference,
		public readonly id: string,
		public readonly nodeId: string | undefined,
		public readonly title: string,
		public readonly url: string,
		public readonly createdDate: Date,
		public readonly updatedDate: Date,
		public readonly closed: boolean,
		public readonly state: IssueOrPullRequestState,
		public readonly author: IssueMember,
		public readonly repository: IssueRepository,
		public readonly assignees: IssueMember[],
		public readonly closedDate?: Date,
		public readonly labels?: IssueLabel[],
		public readonly commentsCount?: number,
		public readonly thumbsUpCount?: number,
		public readonly body?: string,
	) {}
}

export type IssueRepositoryIdentityDescriptor = RequireSomeWithProps<
	RequireSome<RepositoryIdentityDescriptor<string>, 'provider'>,
	'provider',
	'id' | 'domain' | 'repoDomain' | 'repoName'
> &
	RequireSomeWithProps<RequireSome<RepositoryIdentityDescriptor<string>, 'remote'>, 'remote', 'domain'>;

export function getRepositoryIdentityForIssue(issue: IssueShape | Issue): IssueRepositoryIdentityDescriptor {
	if (issue.repository == null) throw new Error('Missing repository');

	return {
		remote: {
			url: issue.repository.url,
			domain: issue.provider.domain,
		},
		name: `${issue.repository.owner}/${issue.repository.repo}`,
		provider: {
			id: issue.provider.id,
			domain: issue.provider.domain,
			repoDomain: issue.repository.owner,
			repoName: issue.repository.repo,
			repoOwnerDomain: issue.repository.owner,
		},
	};
}

export function getVirtualUriForIssue(issue: IssueShape | Issue): Uri | undefined {
	if (issue.repository == null) throw new Error('Missing repository');
	if (issue.provider.id !== 'github') return undefined;

	const uri = Uri.parse(issue.repository.url ?? issue.url);
	return uri.with({ scheme: Schemes.Virtual, authority: 'github', path: uri.path });
}

export async function getOrOpenIssueRepository(
	container: Container,
	issue: IssueShape | Issue,
	options?: { promptIfNeeded?: boolean; skipVirtual?: boolean },
): Promise<Repository | undefined> {
	const identity = getRepositoryIdentityForIssue(issue);
	let repo = await container.repositoryIdentity.getRepository(identity, {
		openIfNeeded: true,
		keepOpen: false,
		prompt: false,
	});

	if (repo == null && !options?.skipVirtual) {
		const virtualUri = getVirtualUriForIssue(issue);
		if (virtualUri != null) {
			repo = await container.git.getOrOpenRepository(virtualUri, { closeOnOpen: true, detectNested: false });
		}
	}

	if (repo == null && options?.promptIfNeeded) {
		repo = await container.repositoryIdentity.getRepository(identity, {
			openIfNeeded: true,
			keepOpen: false,
			prompt: true,
		});
	}

	return repo;
}
