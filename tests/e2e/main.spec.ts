import { test, expect } from '@playwright/test'

// Credenciais via env (obrigatórias — a conta admin fictícia foi removida)
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD
const STUDENT_EMAIL = process.env.E2E_STUDENT_EMAIL
const STUDENT_PASSWORD = process.env.E2E_STUDENT_PASSWORD

const hasAdminCreds = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD)
const hasStudentCreds = Boolean(STUDENT_EMAIL && STUDENT_PASSWORD)
const hasAllCreds = hasAdminCreds && hasStudentCreds

async function loginAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('#email', ADMIN_EMAIL!)
  await page.fill('#password', ADMIN_PASSWORD!)
  await page.click('button:has-text("Entrar")')
  await page.waitForURL('/admin/**')
}

async function loginStudent(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('#email', STUDENT_EMAIL!)
  await page.fill('#password', STUDENT_PASSWORD!)
  await page.click('button:has-text("Entrar")')
  await page.waitForURL('/')
}

test.describe('Cadastro', () => {
  test('cadastrar novo aluno mostra tela de confirmação de e-mail', async ({ page }) => {
    const email = `e2e-${Date.now()}@teste.com`
    await page.goto('/cadastro')
    await page.fill('#name', 'Aluno Teste E2E')
    await page.fill('#email', email)
    await page.fill('#password', 'Senha123')
    await page.fill('#confirmPassword', 'Senha123')
    await page.fill('#birthDate', '2000-01-01')
    await page.fill('#phone', '(11) 99999-9999')
    await page.click('button:has-text("Criar conta")')

    // Com confirmação de e-mail obrigatória: permanece em /cadastro com aviso.
    // Sem confirmação: redireciona para '/'. Toleramos ambos.
    await page.waitForTimeout(2000)
    if (page.url().includes('/cadastro')) {
      await expect(page.locator('text=Conta criada')).toBeVisible()
    } else {
      await expect(page).toHaveURL('/')
    }
  })
})

test.describe('Check-in (aluno + admin)', () => {
  test.skip(!hasAllCreds, 'Defina E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_STUDENT_EMAIL e E2E_STUDENT_PASSWORD (contas confirmadas)')

  test('aluno faz check-in e admin confirma', async ({ page, context }) => {
    // Admin cria treino para hoje
    await loginAdmin(page)
    await page.goto('/admin/treinos/novo')
    await page.fill('#modality', 'Jiu-Jitsu E2E')
    await page.selectOption('#weekday', String(new Date().getDay()))
    await page.fill('#time', '19:00')
    await page.fill('#location', 'Tatame 1')
    await page.fill('#capacity', '30')
    await page.click('button:has-text("Criar treino")')
    await page.waitForURL('/admin/treinos')

    // Logout admin
    await page.click('button:has-text("Sair")')
    await page.waitForURL('/login')

    // Aluno faz check-in
    await loginStudent(page)
    await page.goto('/checkin')
    await page.click('button:has-text("Fazer check-in")')
    await expect(page.locator('text=Aguardando confirmação')).toBeVisible()

    // Admin confirma em outra aba
    const adminPage = await context.newPage()
    await loginAdmin(adminPage)
    await adminPage.goto('/admin/checkins')
    await adminPage.click('button:has-text("Confirmar")')
    await adminPage.waitForSelector('text=Confirmado', { timeout: 10000 })

    // Aluno vê confirmação
    await page.reload()
    await expect(page.locator('text=Confirmado')).toBeVisible()

    // Frequência registrada
    await page.goto('/frequencia')
    await expect(page.locator('text=Jiu-Jitsu E2E')).toBeVisible()
  })
})

test.describe('Notificações', () => {
  test.skip(!hasAllCreds, 'Defina E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_STUDENT_EMAIL e E2E_STUDENT_PASSWORD (contas confirmadas)')

  test('aluno recebe notificação quando check-in é confirmado', async ({ page, context }) => {
    // Admin cria treino
    await loginAdmin(page)
    await page.goto('/admin/treinos/novo')
    await page.fill('#modality', 'Notif E2E')
    await page.selectOption('#weekday', String(new Date().getDay()))
    await page.fill('#time', '20:00')
    await page.fill('#location', 'Tatame 2')
    await page.fill('#capacity', '20')
    await page.click('button:has-text("Criar treino")')
    await page.waitForURL('/admin/treinos')
    await page.click('button:has-text("Sair")')
    await page.waitForURL('/login')

    // Aluno check-in
    await loginStudent(page)
    await page.goto('/checkin')
    await page.click('button:has-text("Fazer check-in")')
    await expect(page.locator('text=Aguardando confirmação')).toBeVisible()

    // Admin confirma
    const adminPage = await context.newPage()
    await loginAdmin(adminPage)
    await adminPage.goto('/admin/checkins')
    await adminPage.click('button:has-text("Confirmar")')
    await adminPage.waitForSelector('text=Confirmado', { timeout: 10000 })

    // Aluno recebe notificação e vê no sino + central
    await page.goto('/notificacoes')
    await expect(page.locator('text=Check-in confirmado')).toBeVisible()
  })
})
