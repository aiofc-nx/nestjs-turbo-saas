import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
	let app: TestingModule;

	beforeAll(async () => {
		app = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService]
		}).compile();
	});

	describe('getAppStatus', () => {
		it('should return app status', async () => {
			const appController = app.get<AppController>(AppController);
			const result = await appController.getAppStatus();
			expect(result).toHaveProperty('status');
			expect(result).toHaveProperty('message');
		});
	});
});
